SELECT 
    a.assignment_id, 
    t.name AS taskName, 
    c.name AS courseName 
FROM Assignment a
JOIN Course c ON a.course_id = c.course_id
JOIN Task t ON a.task_id = t.task_id
ORDER BY a.assignment_id;

SELECT
    c.completion_id,
    c.time,
    a.assignment_id,
    t.name AS taskName
FROM Completion c
JOIN Assignment a ON c.assignment_id = a.assignment_id
JOIN Task t ON a.task_id = t.task_id
ORDER BY c.completion_id;

SELECT 
    s.name AS studentName,
    c.name AS courseName,
    cr.grade,
    cr.credits
FROM Credit cr
JOIN Course c ON cr.course_id = c.course_id
JOIN Student s ON cr.student_id = s.student_id
ORDER BY s.name;

SELECT
    s.name AS studentName,
    t.name AS taskName,
    c.time AS completionTime
FROM Completion c
JOIN Student s ON c.student_id = s.student_id
JOIN Assignment a ON c.assignment_id = a.assignment_id
JOIN Task t ON a.task_id = t.task_id
ORDER BY s.name;

SELECT
    c.name AS courseName,
    COUNT(a.assignment_id) AS assignmentNumber
FROM Course c
LEFT JOIN Assignment a ON c.course_id = a.course_id
GROUP BY c.course_id, c.name
ORDER BY c.name;

SELECT
    c.name AS courseName,
    c.description AS courseDescription
FROM Course c
LEFT JOIN Assignment a ON c.course_id = a.course_id
WHERE a.assignment_id IS NULL
ORDER BY c.name;

SELECT
    a.assignment_id,
    t.name AS taskName,
    c.time AS completionTime
FROM Completion c
JOIN Assignment a ON c.assignment_id = a.assignment_id
JOIN Task t ON a.task_id = t.task_id
WHERE c.time > '2025-01-01'
ORDER BY a.assignment_id;

SELECT
    s.name AS studentName,
    s.major
FROM Student s
LEFT JOIN Credit cr ON s.student_id = cr.student_id
WHERE cr.credit_id IS NULL
ORDER BY s.name;

SELECT
    c.name AS courseName,
    COUNT(DISTINCT cr.student_id) AS studentNumber,
    ROUND(AVG(cr.grade), 2) AS averageGrade,
    SUM(cr.credits) AS creditNumber
FROM Course c
LEFT JOIN Credit cr ON c.course_id = cr.course_id
LEFT JOIN Student s ON cr.student_id = s.student_id
GROUP BY c.course_id, c.name
ORDER BY c.name;