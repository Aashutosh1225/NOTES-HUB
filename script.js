// Global variables
let uploadedNotes = JSON.parse(localStorage.getItem('uploadedNotes')) || [];

// Login functions
function selectLoginType(type) {
    const loginTypeDiv = document.querySelector('.login-type');
    const loginForm = document.getElementById(`${type}-login`);
    
    if (!loginTypeDiv || !loginForm) {
        console.error('Login elements not found');
        return;
    }
    
    loginTypeDiv.style.display = 'none';
    loginForm.style.display = 'block';
}

function validateCreatorForm(event) {
    event.preventDefault();
    try {
        const usernameInput = document.querySelector('#creator-login [name="c_uname"]');
        const passwordInput = document.querySelector('#creator-login [name="c_psw"]');
        
        if (!usernameInput || !passwordInput) {
            throw new Error('Login form elements not found');
        }
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            window.location.href = 'upload.html';
        } else {
            alert('Please fill in all fields');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

function validateReaderForm(event) {
    event.preventDefault();
    try {
        const usernameInput = document.querySelector('#reader-login [name="r_uname"]');
        const passwordInput = document.querySelector('#reader-login [name="r_psw"]');
        
        if (!usernameInput || !passwordInput) {
            throw new Error('Login form elements not found');
        }
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            window.location.href = 'notes.html';
        } else {
            alert('Please fill in all fields');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Payment functions
function downloadFile(fileData, filename) {
    try {
        const a = document.createElement('a');
        a.href = fileData.data;
        a.download = filename || fileData.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(fileData.data);
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download file. Please try again.');
    }
}

function purchaseNote(subject) {
    // Find the note in uploadedNotes
    const note = uploadedNotes.find(n => n.subject === subject);
    if (!note) {
        alert('Note not found');
        return;
    }
    const price = note.price;

    if (confirm(`Confirm purchase of ${subject} notes for NRS ${price}?`)) {
        // Simulate payment processing
        setTimeout(() => {
            const paymentSuccess = Math.random() > 0.1; // 90% success rate
            if (paymentSuccess) {
                alert('Payment successful! Downloading your notes...');
                // Mark the note as purchased
                const purchasedNotes = JSON.parse(localStorage.getItem('purchasedNotes') || '[]');
                purchasedNotes.push(subject);
                localStorage.setItem('purchasedNotes', JSON.stringify(purchasedNotes));
                // Download the file
                downloadFile(note.file, `${note.title}.pdf`);
                // Refresh the notes display
                displayUploadedNotes();
            } else {
                alert('Payment failed. Please try again.');
            }
        }, 1000); // Simulate 1 second processing time
    }
}

// Upload functions
function handleUpload(event) {
    event.preventDefault();
    
    try {
        const titleInput = document.getElementById('noteTitle');
        const subjectInput = document.getElementById('subject');
        const descriptionInput = document.getElementById('description');
        const priceInput = document.getElementById('price');
        const fileInput = document.getElementById('pdfFile');
        
        if (!titleInput || !subjectInput || !descriptionInput || !priceInput || !fileInput) {
            throw new Error('One or more form elements not found');
        }
        
        const noteData = {
            title: titleInput.value,
            subject: subjectInput.value,
            description: descriptionInput.value,
            price: priceInput.value,
            file: {
                name: fileInput.files[0].name,
                data: URL.createObjectURL(fileInput.files[0])
            }
        };

        if (noteData.file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        uploadedNotes.push(noteData);
        localStorage.setItem('uploadedNotes', JSON.stringify(uploadedNotes));
        
        alert('Upload successful!');
        document.getElementById('uploadForm').reset();
        window.location.href = 'notes.html';
    } catch (error) {
        console.error('Upload error:', error);
        alert('An error occurred during upload. Please try again.');
    }
}

// Display functions
function displayUploadedNotes() {
    try {
        const mainContent = document.querySelector('.main');
        if (!mainContent) {
            console.warn('Main content element not found');
            return;
        }

        // Clear existing content
        mainContent.innerHTML = '';

        uploadedNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            
            noteCard.innerHTML = `
                <h2>${note.title}</h2>
                <h5>${note.subject} Notes</h5>
                <p>Price: NRS ${note.price}</p>
                <p>${note.description}</p>
                <button class="purchase-btn" onclick="purchaseNote('${note.subject}')">Purchase</button>
            `;
            
            mainContent.appendChild(noteCard);
        });
    } catch (error) {
        console.error('Display error:', error);
    }
}
