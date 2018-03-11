/**
DBMS_CQ_NOTIFICATION: PAQUETE QUE ES PARTE DE LA FUNCIÓN DE NOTIFICACIÓN ANTE CAMBIOS EN LA BASE DE DATOS. 
PROPORCIONA LA FUNCIONALIDAD DE CREAR REGISTROS EN CONSULTAS DESIGNADAS 
*/

--Habilite los procesos de colas de trabajos para recibir notificaciones.


--Crea una tabla para registrar eventos de notificación
CREATE TABLE nfevents
(
  	regid NUMBER,
	event_type NUMBER --??
);

--Crea una tabla para registrar consultas de notificación
CREATE TABLE nfqueries
(
  	qid NUMBER,
  	qop NUMBER
);

--crea una tabla para registrar los cambios en las tablas registradas
CREATE TABLE nftablechanges
(
	qid NUMBER, --regid
	table_name VARCHAR2(100),
	table_operation NUMBER
);

--crea una tabla para registrar los rowids de las filas modificadas.
CREATE TABLE nfrowchanges	
(
  qid NUMBER, --regid
  table_name VARCHAR2(100),|
  row_id VARCHAR2(2000), --ID ORACLE DE LA FILA
  real_id NUMBER --ID REAL DE LA FILA --esta no estaba en la original
);


CREATE TABLE nfcompleta
(
  regid NUMBER,
  event_type NUMBER, --INSERT/UPDATE: 7
  qid NUMBER,
  qop NUMBER,
  table_name VARCHAR2(100),
  table_operation NUMBER,
  row_id VARCHAR2(2000),
  real_id NUMBER
);

--RECIBE ID OPERACION (INSERT/UPDATE/DELETE) Y EL ID REAL
CREATE TABLE nfOpRealId
(
  operation NUMBER, --IDS DE OPERACION 2: INSERT 4: UPDATE
  real_id NUMBER
);

--BLOQUE ANONIMO 1 (EN HR):
------------------------------------------------------------------------------------------------------------
DECLARE
  reginfo    cq_notification$_reg_info; --
  v_cursor   SYS_REFCURSOR; --CURSOR
  regid      NUMBER;
  qosflags   NUMBER;


--CONSTANTES USADAS DE DBSM_CQ_NOTIFICATION:
--QOS_QUERY: REGISTRARSE EN GRANULARIDAD DE CONSULTA
--QOS_ROW_IDS: REQUIERE ROW_IDS DE FILAS MODIFICADAS
--NEW_REG_START:
--

--'chnf_callback_dos': MANEJADOR DE NOTIFICACIONES
BEGIN
  qosflags := DBMS_CQ_NOTIFICATION.QOS_QUERY + DBMS_CQ_NOTIFICATION.QOS_ROWIDS;
  reginfo := cq_notification$_reg_info ('chnf_callback_dos', qosflags,0, 0, 0);
  regid := DBMS_CQ_NOTIFICATION.NEW_REG_START (reginfo);

  --CURSOR:
  OPEN v_cursor
    FOR
    SELECT DBMS_CQ_NOTIFICATION.CQ_NOTIFICATION_QUERYID, department_id, department_name, manager_id, location_id
    FROM HR.departments;
  CLOSE v_cursor;
  --FIN CURSOR

  DBMS_CQ_NOTIFICATION.REG_END;
END;
/

--BLOQUE ANONIMO 2 (EN HR): CREA UN MANEJADOR CALLBACK PARA PROCESAR LAS NOTIFICACIONES
------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE chnf_callback_dos(ntfnds IN CQ_NOTIFICATION$_DESCRIPTOR) IS
  regid           NUMBER;
  event_type      NUMBER;
  tbname          VARCHAR2(60);
  numtables       NUMBER;
  operation_type  NUMBER;
  numrows         NUMBER;
  row_id          VARCHAR2(2000);
  numqueries      NUMBER;--
  qid             NUMBER;--
  qop             NUMBER;--
  real_id         NUMBER;--

BEGIN
  regid := ntfnds.registration_id;
  event_type := ntfnds.event_type;

	--INSERTA EN NFEVENTS (EVENTOS DE NOTIFICACIÓN)
	INSERT INTO nfevents
	VALUES(regid, event_type);

	numqueries :=0;

	--EVENT_TYPE = DBMS_CQ_NOTIFICATION.EVENT_OBJCHANGE
  IF (event_type = DBMS_CQ_NOTIFICATION.EVENT_QUERYCHANGE) THEN
    numqueries := ntfnds.query_desc_array.count; --NUMERO DE 
    
	FOR i in 1..numqueries LOOP
      qid := ntfnds.QUERY_DESC_ARRAY(i).queryid;
      qop := ntfnds.QUERY_DESC_ARRAY(i).queryop;

      --INSERT EN NFQUERIES
      INSERT INTO nfqueries
      VALUES(qid, qop);

      numtables := 0;
      numtables := ntfnds.QUERY_DESC_ARRAY(i).table_desc_array.count;
          
      FOR j IN 1..numtables LOOP
        tbname := ntfnds.QUERY_DESC_ARRAY(i).table_desc_array(j).table_name;
        operation_type := ntfnds.QUERY_DESC_ARRAY(i).table_desc_array(j).Opflags;

        --INSERTA EN NFTABLECHANGES(REGISTROS DE LOS CAMBIOS EN LAS TABLAS)
        INSERT INTO nftablechanges
    	VALUES(qid, tbname, operation_type);

		--EnvIA el nombre de tabla y tipo_operación al oyente del lado del cliente utilizando UTL_HTTP
		--OBTENIENDO LOS ROW_IDS
		--ACCEDE A DESCRIPTORES DE FILA SOLO SI NO SE HAN MODIFICADO TODAS LAS FILAS (BIT ALL_ROWS)
        IF (bitand(operation_type, DBMS_CQ_NOTIFICATION.ALL_ROWS) = 0) THEN
          numrows := ntfnds.query_desc_array(i).table_desc_array(j).numrows;
        ELSE
          numrows :=0; --ROW_IDS NO DISPONIBLES (NO HAY FILAS)
        END IF;
    
        --EL LOOP NO SE EJECUTA CUANDO NUMROWS ES CERO
        FOR k IN 1..numrows LOOP
          Row_id := ntfnds.query_desc_array(i).table_desc_array(j).row_desc_array(k).row_id;

          select department_id
          into real_id
          from hr.departments
          where rowid = Row_id;
          
          -->INSERT EN NFROWCHANGES<--
          INSERT INTO nfrowchanges
          VALUES(qid, tbname, Row_id, real_id);

          -->INSERT EN NFCOMPLETA<--
          INSERT INTO nfcompleta
          VALUES(regid, event_type, qid, qop, tbname, operation_type, Row_id, real_id);

          IF(operation_type = 2) THEN
            INSERT INTO nfOpRealId
            VALUES (2, real_id);
          ELSIF (operation_type = 4) THEN
            INSERT INTO nfOpRealId
          VALUES (4, real_id);
          ELSE
            INSERT INTO nfOpRealId
            VALUES (operation_type, real_id);
          END IF;

        END LOOP;
      END LOOP;
    END LOOP;
  END IF;

  COMMIT;
END;
/


--QUERIES DE EJEMPLO:
------------------------------------------------------------------------------------------------------------
INSERT INTO DEPARTMENTS
VALUES
  (280, 'Depto 280', null, null);
COMMIT;

UPDATE departments SET department_name = 'FINANCE' WHERE department_name = 'Depto 280';
COMMIT;

DELETE FROM DEPARTMENTS WHERE DEPARTMENT_ID=280;
COMMIT;