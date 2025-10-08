class Product{

    constructor(
        id = "",        
        category = "",
        product_name = "",
        detail = "",
        price ="",
        stock = "",
        image = "",
        created = "",
        store = "",
        store_name = "",
        owner = "",
        username = "",
        name = new Name(),
        phone_num = "",
        email = ""

    ){
        this.id = id;
        this.store = store;
        this.store_name = store_name;
        this.owner = owner;
        this.category = category; 
        this.product_name = product_name;
        this.detail  = detail;
        this.price  = price;
        this.stock = stock;
        this.image = image;
        this.created = created; 
        this.username = username;
        this.name = name;
        this.phone_num = phone_num;
        this.email = email;
    }
}

class Name {
    constructor(fname = "", lname = "") {
        this.fname = fname;
        this.lname = lname;
        this.text = fname + " " + lname;
    };
};


module.exports = {Product, Name}