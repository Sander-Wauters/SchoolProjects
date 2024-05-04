function goToFirstBlogPost() {
    cy.get("[data-cy=navbar_blog]").click();
    cy.get("[data-cy=blogPostHeader]").first().click();
}

// ---------- // PREREQUISITES // ---------- //
// There exists 1 blog posts.
// The following users have no comments on this blog post:
//      user
//      admin
// The folowing users exist:
//      username: user
//      password: Server2022
//      role: user
//
//      username: admin
//      password: Server2022
//      role: admin
// ---------- // PREREQUISITES // ---------- //
describe("Add comment", () => {
    describe("Valid user", () => {
        beforeEach(() => {
            cy.login("user", "Server2022");
            goToFirstBlogPost();
        });

        it("should add a comment", () => {
            cy.get("[data-cy=commentForm_content]").type("e2e test content");
            cy.get("[data-cy=commentForm_submit]").click();

            cy.get("[data-cy=comment_createdBy]").last().contains("user commented on");
            cy.get("[data-cy=comment_content]").last().contains("e2e test content");
        });

        it("should edit the comment", () => {
            cy.get("[data-cy=comment_edit]").last().click();
            cy.get("[data-cy=commentForm_content]").first().type(" edit");
            cy.get("[data-cy=commentForm_submit]").first().click();

            cy.get("[data-cy=comment_createdBy]").last().contains("last edited on");
            cy.get("[data-cy=comment_content]").last().contains("e2e test content edit");
        });

        it("should remove the comment", () => {
            cy.on("window:confirm", (str) => {
                expect(str).to.eq("Are you sure you want to remove this comment?");
            });
            cy.get("[data-cy=comment_remove]").last().click();
        });
    });

    describe("Invalid user", () => {
        before(() => {
            cy.login("admin", "Server2022");
            goToFirstBlogPost();
            cy.get("[data-cy=commentForm_content]").type("admin e2e test content");
            cy.get("[data-cy=commentForm_submit]").click();
        });

        after(() => {
            cy.login("admin", "Server2022");
            goToFirstBlogPost();
            cy.on("window:confirm", (str) => {
                expect(str).to.eq("Are you sure you want to remove this comment?");
            });
            cy.get("[data-cy=comment_remove]").last().click();
        });

        beforeEach(() => {
            cy.login("user", "Server2022");
            goToFirstBlogPost();
        });

        
        it("should not be able to edit the comment", () => {     
            cy.get("[data-cy=comment_edit]").should("not.exist");
        });

        it("should not be able to remove the comment", () => {     
            cy.get("[data-cy=comment_remove]").should("not.exist");
        });
    });

    describe("Not logged in", () => {
        before(() => {
            cy.login("admin", "Server2022");
            goToFirstBlogPost();
            cy.get("[data-cy=commentForm_content]").type("admin e2e test content");
            cy.get("[data-cy=commentForm_submit]").click();
            cy.logout();
            goToFirstBlogPost();
        });

        after(() => {
            cy.login("admin", "Server2022");
            goToFirstBlogPost();
            cy.on("window:confirm", (str) => {
                expect(str).to.eq("Are you sure you want to remove this comment?");
            });
            cy.get("[data-cy=comment_remove]").last().click();
        });

        it("should not be able to add a comment", () => {
            cy.get("[data-cy=commentForm_content]").should("not.exist");
            cy.get("[data-cy=commentForm_submit]").should("not.exist");
        });

        it("should not be able to edit the comment", () => {     
            cy.get("[data-cy=comment_edit]").should("not.exist");
        });

        it("should not be able to remove the comment", () => {     
            cy.get("[data-cy=comment_remove]").should("not.exist");
        });
    });
});
