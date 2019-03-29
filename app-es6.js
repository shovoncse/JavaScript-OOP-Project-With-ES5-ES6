// Local Storage Class
class Contact {
    constructor(name, email, phone, birthday){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.birthday = birthday;
    }
}

// UI Class
class UI {

    addContactToList(contact) {
        const list = document.getElementById('contact-list');
        // Create tr Element
        const row = document.createElement('tr');
        // Insert Column
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.birthday}</td>
            <td><a class="btn btn-floating delete">x</a></td>
        `;
        list.appendChild(row);
    }

    showAlert(getMsg, getClass) {
        
        // Show Progress
        document.querySelector('.progress').style.display = 'block';

        setTimeout(function(){
            document.querySelector('.progress').style.display = 'none';
            // Create div
            const div = document.createElement('div');
            // Add Classes
            div.className = `alert alert-${getClass}`;
            // Add Text
            div.appendChild(document.createTextNode(getMsg));
            // Get Parent
            const card = document.querySelector('.card');
            // Get Form
            const cardAction = document.querySelector('.card-action');
            // Insert Alert
            card.insertBefore(div, cardAction);
            // Timeout 3 Seconds for alert dismiss
            setTimeout(function(){
                document.querySelector('.progress').style.display = 'none';
                document.querySelector('.alert').remove();
            },2000);
        },1000);
        
    }
    
    deleteContact(target) {
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
            return true;
        }else{
            return false;
        }

    }
    
    clearFields() {

        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('birthday').value = '';

    }

    searchName(text){
        const rows = document.querySelectorAll('#contact-list tr');
        rows.forEach(function(row){
            if(row.children[0].textContent.indexOf(text) != -1){
                row.style.display = 'table-row';                
            }else{
                row.style.display = 'none';
            };
        });

    }
}

// Local Storage Class
class Store {

    static getContact(){
        let contact;
        if(localStorage.getItem('contacts') === null){
            contact = [];
        }else {
            contact = JSON.parse(localStorage.getItem('contacts'));
        }

        return contact;
    }
    
    static displayContact(){
        const contacts = Store.getContact();

        contacts.forEach(function(contact){
            const ui =  new UI();

            // Add book to UI
            ui.addContactToList(contact);

        });
    }
    
    static addContact(contact){

        //Books from LocalStorage
        const contacts = Store.getContact();

        // Push New book into book array with previous array
        contacts.push(contact);

        localStorage.setItem('contacts', JSON.stringify(contacts));

    }
    
    static removeContact(phone){
        
        const contacts = Store.getContact();

        contacts.forEach( (contact, index) => {
            if(contact.phone === phone) {
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));

    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayContact());

// Event Listener
document.getElementById('contact-form').addEventListener('submit', function(e){
    
    e.preventDefault();
    
    // Get Form Values
    const name = document.getElementById('name').value,
        email = document.getElementById('email').value,
        phone = document.getElementById('phone').value;
        birthday = document.getElementById('birthday').value;

        // Instantiate Contact
        const contact = new Contact(name, email, phone, birthday);

        // Instantiate UI
        const ui = new UI();

        // Validate
        if(name === '' || phone === ''){

            // Error Alert
            ui.showAlert('Please fill Name & Phone Fields at least', 'danger');
        
        }else{

            //Add contact to list
            ui.addContactToList(contact);
            // Add contact to Local Storage
            Store.addContact(contact);
            // Show Success
            ui.showAlert('New Contact Added!', 'success');
            // Clear Fields
            ui.clearFields();
        
        }

    
});

document.getElementById('contact-list').addEventListener('click', function(e){

    // Instantiate UI
    const ui = new UI();

    if(confirm('Are you sure?')){
        if(ui.deleteContact(e.target)){
            //Remove from LS
            Store.removeContact(e.target.parentElement.parentElement.children[2].textContent);

            // Show message
            ui.showAlert('Contact Removed!', 'info');
        }else{
            // Show message
            ui.showAlert('Contact Not Removed!', 'warning');
        }
    }
    e.preventDefault();

});

document.getElementById('search').addEventListener('keyup', function(e){
    const ui = new UI();
    ui.searchName(e.target.value);
});

