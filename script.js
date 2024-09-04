document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('student-form');
    const tableBody = document.getElementById('student-table').getElementsByTagName('tbody')[0];

    // Load saved records from local storage
    const loadRecords = () => {
        const records = JSON.parse(localStorage.getItem('students')) || [];
        tableBody.innerHTML = '';
        records.forEach(record => addRow(record));
    };

    // Save records to local storage
    const saveRecords = (records) => {
        localStorage.setItem('students', JSON.stringify(records));
    };

    // Add a row to the table
    const addRow = (record) => {
        const row = tableBody.insertRow();
        row.classList.add('fade-in');
        row.insertCell(0).textContent = record.name;
        row.insertCell(1).textContent = record.studentId;
        row.insertCell(2).textContent = record.email;
        row.insertCell(3).textContent = record.contact;

        const actionsCell = row.insertCell(4);
        actionsCell.className = 'actions';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition duration-300 mr-2';
        editButton.onclick = () => editRecord(record, row);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300';
        deleteButton.onclick = () => deleteRecord(record, row);
        actionsCell.appendChild(deleteButton);
    };

    // Check for duplicate records based on student ID, mobile number, and email
    const isDuplicate = (record) => {
        let records = JSON.parse(localStorage.getItem('students')) || [];
        return records.some(r =>
            r.studentId === record.studentId ||
            r.email === record.email ||
            r.contact === record.contact
        );
    };

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const studentId = form['student-id'].value.trim();
        const email = form.email.value.trim();
        const contact = form.contact.value.trim();

        // Validation
        if (!name || !studentId || !email || !contact || isNaN(studentId) || isNaN(contact)) {
            alert('Please fill all fields correctly.');
            return;
        }

        const record = { name, studentId, email, contact };

        // Check for duplicate record
        if (isDuplicate(record)) {
            alert('A record with the same Student ID, Email, or Contact Number already exists.');
            return;
        }

        let records = JSON.parse(localStorage.getItem('students')) || [];
        records.push(record);
        saveRecords(records);
        addRow(record);
        form.reset(); // Reset form fields after adding
    });

    // Edit a record
    const editRecord = (record, row) => {
        form.name.value = record.name;
        form['student-id'].value = record.studentId;
        form.email.value = record.email;
        form.contact.value = record.contact;

        // Remove the record from local storage
        let records = JSON.parse(localStorage.getItem('students')) || [];
        records = records.filter(r => r.studentId !== record.studentId);
        saveRecords(records);
        tableBody.removeChild(row);
    };

    // Delete a record
    const deleteRecord = (record, row) => {
        if (confirm('Are you sure you want to delete this record?')) {
            let records = JSON.parse(localStorage.getItem('students')) || [];
            records = records.filter(r => r.studentId !== record.studentId);
            saveRecords(records);
            row.classList.add('highlight'); // Highlight row before deletion
            setTimeout(() => {
                tableBody.removeChild(row);
            }, 500); // Remove row after highlighting
        }
    };

    // Load initial records
    loadRecords();
});
