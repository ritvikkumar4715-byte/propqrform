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

    if (name && phone && email) {
        const userData = { name, phone, email, timestamp: new Date().toISOString() };
        localStorage.setItem("propyter_user", JSON.stringify(userData));

        const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeobt2gUT_QAGB9EgROPCo_OHRIWVXr0hLRkaa_IScZ1RMbNg/formResponse";
        
        const formData = new FormData();
        formData.append("entry.892743565", name);
        formData.append("entry.1102492608", phone);
        formData.append("entry.78828674", email);

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