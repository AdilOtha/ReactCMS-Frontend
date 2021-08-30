class Auth {
    constructor() {
        this.authenticated = false;
    }

    login(cb) {
        this.authenticated = true;
        cb();
    }

    logout(cb) {
        this.authenticated = false;
        cb();
    }

    isAuthenticated() {
        if(localStorage.getItem("token")){
            return true;
        } else {
            return false;
        }
    }
}

export default new Auth();