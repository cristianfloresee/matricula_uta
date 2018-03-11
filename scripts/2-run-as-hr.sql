/* Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * DESCRIPTION
 *   This file creates a table and inserts some sample data that are used by
 *   the application. A query registration is also created. Finally, the
 *   procedure that will be executed when the data changes is created.
 *
 *   Remember to change the IP address in the procedure from 127.0.0.1 to the
 *   correct IP address for the Node.js server.
 *
 *****************************************************************************/

DROP TABLE jsao_super_cities;

CREATE SEQUENCE jsao_super_cities_seq INCREMENT BY 1 START WITH 1;

CREATE TABLE jsao_super_cities (
   id           NUMBER,
   city_name    VARCHAR2(30 BYTE),
   country_name VARCHAR2(20 BYTE),
   votes        NUMBER,
   CONSTRAINT "ID" PRIMARY KEY ("ID")
);

CREATE OR REPLACE TRIGGER bir_jsao_super_cities_trg
   BEFORE INSERT ON jsao_super_cities
   FOR EACH ROW
BEGIN
   IF :new.id IS NULL
   THEN
      :new.id := jsao_super_cities_seq.nextval;
   END IF;
END bir_jsao_super_cities_trg;
/

SET DEFINE OFF;

INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('New York City', 'USA', 100);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Tokyo', 'Japan', 98);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Paris', 'France', 99);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Barranquilla', 'Colombia', 99);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Mexico City', 'Mexico', 95);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('New Delhi', 'India', 96);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Shanghai', 'China', 95);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Buenos Aires', 'Argentina', 96);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Amsterdam', 'Netherlands', 98);
INSERT INTO jsao_super_cities (city_name, country_name, votes) VALUES ('Sao Paulo', 'Brazil', 97);

COMMIT;

DECLARE

   l_reginfo CQ_NOTIFICATION$_REG_INFO; --reginfo -- antiguo https://docs.oracle.com/cd/E11882_01/appdev.112/e41502/adfns_cqn.htm#CHEEDHCG
   l_cursor  SYS_REFCURSOR;  --v_cursor           -- nuevo https://docs.oracle.com/cd/E11882_01/appdev.112/e40758/d_cqnotif.htm#ARPLS201
   l_regid   NUMBER; --regid

BEGIN

    l_reginfo := cq_notification$_reg_info (
        'query_callback', -- CALLBACK
        dbms_cq_notification.qos_query + dbms_cq_notification.qos_rowids, -- QOSFLAGS https://docs.oracle.com/cd/E11882_01/appdev.112/e41502/adfns_cqn.htm#g4923183
        0, -- TIMEOUT, 0 -> registration persists until unregistered
        0, -- OPERATIONS_FILTER, 0 -> notify on all operations ("Has no effect if you specify the QOS_FLAGS attribute with its QOS_QUERY flag.")
           -- http://prntscr.com/ilz7s0
        0  -- TRANSACTION_LAG, 0 -> notify immediately
    );

    l_regid := dbms_cq_notification.new_reg_start(l_reginfo);

    OPEN l_cursor FOR
        SELECT dbms_cq_notification.cq_notification_queryid,
            id,
            city_name,
            country_name,
            votes
        FROM hr.jsao_super_cities;
    CLOSE l_cursor;

    dbms_cq_notification.reg_end;

END;
/

--The following procedure will be executed when the query results are changed
--Set the IP address in the url param to the IP address where where Node.js is listening
CREATE OR REPLACE PROCEDURE query_callback(
    ntfnds IN CQ_NOTIFICATION$_DESCRIPTOR
)

IS

    l_req  UTL_HTTP.REQ;
    l_resp UTL_HTTP.RESP;

BEGIN

    l_req := utl_http.begin_request(
        url    => 'localhost:3000/db',
        method => 'GET'
    );

    l_resp := utl_http.get_response(r => l_req);

    utl_http.end_response(r => l_resp);

END;
/