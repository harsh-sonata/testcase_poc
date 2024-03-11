function generateTestCases(event) {
  // Prevent the default form submission
  event.preventDefault();
 
  // Get the form element
  const form = document.getElementById('generate-test-cases-form');
 
  // Simulate form submission using fetch
  fetch('/generate-test-cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codeSnippet: form.querySelector('textarea[name="codeSnippet"]').value,
    }),
  })
  .then(response => response.json())  // Convert the response to JSON
  .then(data => {
    // Update the output div with the received testCases
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
 
    if (data.testCases) {
      const testCasesList = document.createElement('ul');
 
      data.testCases.split('\n').forEach(testCase => {
        const listItem = document.createElement('li');
        listItem.textContent = testCase.trim();
        testCasesList.appendChild(listItem);
 
       
      });
 
      outputDiv.appendChild(testCasesList);
    } else {
      outputDiv.textContent = 'No test cases generated yet. Enter your code snippet and click the button above.';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('output').textContent = 'Error: Internal Server Error';
  });
}