module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("BlogPost", [
            {
                username: "admin",
                tag: "development",
                date: "2023-12-02",
                title: "Hello World!",
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet elit vel lacus fermentum, quis facilisis lorem dapibus. Duis condimentum elit nisl, ac sodales magna cursus pellentesque. Mauris condimentum dictum varius. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque viverra massa in elit tempus imperdiet. Nullam sapien tortor, tempor nec sagittis ut, fermentum sed ante. Nulla semper massa magna, a fermentum augue euismod et. Sed sed lobortis massa. Ut sed fringilla justo. Duis iaculis nunc id elit accumsan convallis. Nunc purus nisl, cursus sit amet maximus sed, sagittis nec sapien. Nulla pharetra magna a lorem feugiat euismod. Vivamus felis leo, molestie in dignissim in, hendrerit sed nisi."
            },
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("BlogPost", null, {});
    },
};
