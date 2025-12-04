CREATE TABLE Student (
    student_id INT NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    birthday DATE NOT NULL,
    major VARCHAR(200) NOT NULL
);

CREATE TABLE Task (
    task_id INT NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500) NOT NULL
);

CREATE TABLE Course (
    course_id INT NOT NULL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(500) NOT NULL
);

CREATE TABLE Assignment (
    assignment_id INT NOT NULL PRIMARY KEY,
    task_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES Task(task_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

CREATE TABLE Completion (
    completion_id INT NOT NULL PRIMARY KEY,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    time DATE NOT NULL,
    FOREIGN KEY (assignment_id) REFERENCES Assignment(assignment_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);

CREATE TABLE Credit (
    credit_id INT NOT NULL PRIMARY KEY,
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    grade FLOAT NOT NULL,
    credits INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Course(course_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);

