function toggleMenu() {
    var dropdown = document.getElementById("myDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}
 const profileForm = document.getElementById('profileForm');
    const updateBtn = document.getElementById('updateBtn');
    const fileInput = document.getElementById('fileInput');
    const avatarPreview = document.getElementById('avatarPreview');

    // 1. Load saved data from browser memory on page load
    window.onload = function() {
        if(localStorage.getItem('fullname')) document.getElementById('fullname').value = localStorage.getItem('fullname');
        if(localStorage.getItem('gender')) document.getElementById('gender').value = localStorage.getItem('gender');
        if(localStorage.getItem('genotype')) document.getElementById('genotype').value = localStorage.getItem('genotype');
        if(localStorage.getItem('blood_group')) document.getElementById('blood_group').value = localStorage.getItem('blood_group');
        if(localStorage.getItem('email')) document.getElementById('email').value = localStorage.getItem('email');
        if(localStorage.getItem('phone')) document.getElementById('phone').value = localStorage.getItem('phone');
        if(localStorage.getItem('avatar')) avatarPreview.src = localStorage.getItem('avatar');
    };

    // 2. Watch all inputs for changes to trigger the Green Button!
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateBtn.classList.add('active');
            updateBtn.removeAttribute('disabled');
        });
    });

    // 3. Handle the image preview
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
                // Keep image in storage
                localStorage.setItem('avatar', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // 4. Save data to browser memory when button is clicked
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page from refreshing
        
        localStorage.setItem('fullname', document.getElementById('fullname').value);
        localStorage.setItem('gender', document.getElementById('gender').value);
        localStorage.setItem('genotype', document.getElementById('genotype').value);
        localStorage.setItem('blood_group', document.getElementById('blood_group').value);
        localStorage.setItem('email', document.getElementById('email').value);
        localStorage.setItem('phone', document.getElementById('phone').value);

        alert('Profile saved successfully!');
        
        // Reset button back to dark and disabled
        updateBtn.classList.remove('active');
        updateBtn.setAttribute('disabled', 'true');
    });

