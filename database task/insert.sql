INSERT OR IGNORE INTO Student (student_id, name, birthday, major) VALUES
(1, 'Alex', '2002-07-12', 'computer science'),
(2, 'Bob', '2001-11-20', 'mathematics'),
(3, 'Anna', '2003-02-05', 'physics');

INSERT OR IGNORE INTO Task (task_id, name, description) VALUES
(101, 'Homework 1', 'complete the first homework assignment'),
(102, 'Project 1', 'develop a small course project'),
(103, 'Essay 1', 'write a short essay');

INSERT OR IGNORE INTO Course (course_id, name, description) VALUES
(201, 'Programming', 'Introduction to programming'),
(202, 'Advanced math', 'Intermediate mathematics course'),
(203, 'Physics basics', 'Foundations of physics');

INSERT OR IGNORE INTO Assignment (assignment_id, task_id, course_id) VALUES
(301, 101, 201),
(302, 102, 202),
(303, 103, 203);

INSERT OR IGNORE INTO Completion (completion_id, assignment_id, student_id, time) VALUES
(401, 301, 1, '2024-05-10'),
(402, 302, 2, '2024-05-12'),
(403, 303, 3, '2024-05-15');

INSERT OR IGNORE INTO Credit (credit_id, course_id, student_id, date, grade, credits) VALUES
(501, 201, 1, '2024-06-01', 2.5, 3),
(502, 202, 2, '2024-06-03', 3.0, 4),
(503, 203, 3, '2024-06-05', 1.9, 3);

INSERT OR IGNORE INTO Credit (credit_id, course_id, student_id, date, grade, credits) VALUES
(501, 201, 1, '2024-06-01', 1.5, 3),
(502, 202, 2, '2024-06-03', 2.0, 4),
(503, 203, 3, '2024-06-05', 1.8, 3);