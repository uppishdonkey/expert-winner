SELECT
  e.id,
  e.first_name,
  e.last_name,
  roles.title,
  department.name AS department,
  roles.salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
LEFT JOIN role ON e.roles_id = roles.id
LEFT JOIN department ON roles.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id;

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES (?, ?, ?, ?);

UPDATE employee
SET roles_id = new_role_id
WHERE id = employee_id;