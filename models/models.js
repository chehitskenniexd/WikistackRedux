var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT, //unlimited length
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
}, {
    hooks: {
        beforeValidate: (page) => {
            if(page.title){
                page.urlTitle = page.title.replace(/s+/g, '_').replace(/\W/g, '');
            }
        }
    },
    // end Page hooks
    gettersMethods: {
        route: () => `wiki/${this.urlTitle}`
    }
    // end Page getters
}
    // end Page table
);

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}
    // end User table
)

module.exports = {
    Page: Page,
    User: User
}