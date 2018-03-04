document.body.onload = function () {
    addFormListener();
    Net.queryAccounts(UI.disableForm, UI.addAccountToRadioSelector);
    Net.subscribeToPending(UI.setLogPanelPending);
    Net.subscribeToLatest(UI.setLogPanelComplete);
};

function addFormListener() {
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        var form = event.target;
        var request = {from: form.elements.account.value,
            to: form.elements.recipient.value,
            value: form.elements.transactionValue.value};

        Net.sendTransaction(request, sendTransactionCallback);
    });
}

function sendTransactionCallback(error, response) {
    if (error) {
        UI.createErrorPanel(error);
    } else {
        UI.createLogPanel(response);
    }
}