REVOKE DELETE, UPDATE ON TABLE confirmed_payments FROM PUBLIC;

CREATE OR REPLACE FUNCTION block_delete_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'DELETE and UPDATE operations are not allowed on this table.';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_delete_update
BEFORE DELETE OR UPDATE ON confirmed_payments
FOR EACH ROW
EXECUTE FUNCTION block_delete_update();
