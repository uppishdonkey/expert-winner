SELECT roles.id, roles.title, roles.salary, department.name AS department
FROM roles
INNER JOIN department ON role.department_id = department.id;

INSERT INTO roles (title, salary, department_id)
VALUES (?, ?, ?);