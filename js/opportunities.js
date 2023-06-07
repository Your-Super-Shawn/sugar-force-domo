/**
 * @descriptipn This code demonstrates how to interact with various Domo APIs to perform
 * CRUD operations (Create, Read, Update, Delete) on business data.
 */

// This function retrieves a list of opportunity documents from a Domo collection and
// transforms each document into a row to be displayed in a table.
function getOpportunities() {
  domo
    .get(`/domo/datastores/v1/collections/opportunities/documents/`)
    .then((opportunities) => {
      const rows = opportunities.map((opportunity) => ({
        id: opportunity.id,
        ...opportunity.content,
      }));
      const options = {
        editable: true,
        action: updateOpportunity,
      };
      drawTable(rows, "opportunities-table", options);
    });

  // Test -> User API
  domo.get(`/domo/environment/v1`).then((env) => {
    return domo
      .get(`/domo/users/v1/${env.userId}?includeDetails=true`)
      .then((user) => {
        console.log("currentuser", user);
      });
  });
  // Test -> Groups API
  domo.get(`/domo/groups/v1/1334520569`).then((group) => console.log(group));
}

// This function updates an existing opportunity document in a Domo collection and then
// refreshes the opportunity list.
function updateOpportunity(id, document) {
  domo
    .put(`/domo/datastores/v1/collections/opportunities/documents/${id}`, {
      content: document,
    })
    .then(getOpportunities);
}

// This function creates a new opportunity document in a Domo collection and then
// refreshes the opportunity list.
function createOpportunity(document) {
  domo
    .post(`/domo/datastores/v1/collections/opportunities/documents/`, {
      content: document,
    })
    .then(getOpportunities);
}

// This function retrieves lead information, specifically company names, from a
// Domo data set.
function getLeads() {
  return domo.get(`/data/v1/leads?fields=company_name&groupby=company_name`);
}

// This function uploads a file to Domo's data center.
function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const options = { contentType: "multipart" };
  return domo.post(`/domo/data-files/v1?name=${file.name}`, formData, options);
}

// This function deletes an opportunity document from a domo collection and then
// refreshes the opportunity list.
function deleteOpportunity(id) {
  domo
    .delete(`/domo/datastores/v1/collections/opportunities/documents/${id}`)
    .then(getOpportunities);
}

// This function is the entry point for the code. It creates a new opportunity object
(function () {
  const opportunity = {
    company_name: new AutoComplete(getLeads),
    amount: 0,
    notes: "",
    attachment: new FileUpload(uploadFile),
    attachment2: new FileUpload(uploadFile),
  };

  addButton(opportunity, createOpportunity);

  getOpportunities();
})();
