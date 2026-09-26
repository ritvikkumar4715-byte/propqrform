document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("propyter_user");
    
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        activateApp(userData.name);
    } else {
        document.getElementById("auth-gate").style.display = "flex";
    }
});

function handleAuth(event) {
    event.preventDefault();
    
    const name = document.getElementById("user-name").value.trim();
    const phone = document.getElementById("user-phone").value.trim();
    const email = document.getElementById("user-email").value.trim();

    // 1. Gather selected services
    const selectedServices = [];
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    
    checkboxes.forEach(cb => {
        if (cb.id === "other-checkbox") {
            const otherText = document.getElementById("other-text-input").value.trim();
            if (otherText) {
                selectedServices.push(`Other: ${otherText}`);
            } else {
                selectedServices.push("Other");
            }
        } else {
            selectedServices.push(cb.value);
        }
    });

    const servicesString = selectedServices.join("; ");

    if (name && phone && email) {
        const userData = { 
            name, 
            phone, 
            email, 
            services: selectedServices,
            timestamp: new Date().toISOString() 
        };
        localStorage.setItem("propyter_user", JSON.stringify(userData));

        const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLScSbSh5TmdpC6WNTmwMm3zD1szJ-V83cXyo3SxA66N-Xy6yJw/formResponse";
        
        const formData = new FormData();
        formData.append("entry.1835524826", name);
        formData.append("entry.1431385572", phone);
        formData.append("entry.1536355563", email);
        formData.append("entry.1409921329", servicesString);

        fetch(formUrl, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        }).catch(error => {
            console.log("Form submission handled.", error);
        });

        activateApp(name);
    }
}

function activateApp(userName) {
    document.getElementById("auth-gate").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("display-name").textContent = userName;
}

function resetToHome() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logoutDevice() {
    if (confirm("Clear saved credentials for this device?")) {
        localStorage.removeItem("propyter_user");
        location.reload();
    }
}