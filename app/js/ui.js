var UI = {};

UI.addAccountToRadioSelector = function (account) {
    var queryRadio = document.querySelector('#account-selector');

    var input = document.createElement('option');
    input.value = account;
    input.textContent = account;

    input.id = 'account-' + account;
    queryRadio.appendChild(input);
};

UI.disableForm = function () {
    var button = document.querySelector('#send-transaction-form button');
    button.disabled = true;

    var form = document.querySelector('#send-transaction-form');
    form.textContent = "Please start an Ethereum Network on your local computer and open a RPC Port on port 8545. Then refresh.";
};


UI.createFontAwesomeIcon = function (identifier) {
    var icon = document.createElement('i');
    icon.className = 'fa ' + identifier;
    return icon;
};

UI.createLogPanel = function (response) {

    var log = document.querySelector('#transaction-log');
    var entry = document.createElement('div');
    entry.id = 'transaction-' + response.hash;
    entry.className = 'waiting-transaction transaction panel';

    var addressLabel = document.createElement('p');
    addressLabel.id = entry.id + '-hash';
    addressLabel.textContent = response.hash;
    addressLabel.textContent = 'TX: ' + response.hash;
    entry.appendChild(addressLabel);

    var senderLabel = document.createElement('p');
    senderLabel.id = entry.id + '-from';
    senderLabel.textContent = 'From: ' + response.from;
    entry.appendChild(senderLabel);

    var receiverLabel = document.createElement('p');
    receiverLabel.id = entry.id + '-to';
    receiverLabel.textContent = 'To: ' + response.to;
    entry.appendChild(receiverLabel);

    var valueLabel = document.createElement('p');
    valueLabel.id = entry.id + '-value';
    valueLabel.textContent = 'Value: ' + response.v;
    entry.appendChild(valueLabel);

    entry.appendChild(UI.createFontAwesomeIcon('fa-pause'));
    log.appendChild(entry);
};

UI.createErrorPanel = function (response) {
    var log = document.querySelector('#transaction-log');
    var entry = document.createElement('div');
    entry.id = 'transaction-' + response;
    entry.textContent = response;
    entry.className = 'error-transaction transaction panel';
    entry.appendChild(UI.createFontAwesomeIcon('fa-exclamation-circle'));
    log.appendChild(entry);
};

UI.setLogPanelPending = function (transaction) {
    var logEntry = document.querySelector('#transaction-' + transaction);
    logEntry.className = 'pending-transaction transaction panel';
    logEntry.removeChild(document.querySelector('#transaction-' + transaction + ' svg'));
    logEntry.appendChild(UI.createFontAwesomeIcon('fa-clock'));
};

UI.setLogPanelComplete = function (transaction) {
    var logEntry = document.querySelector('#transaction-' + transaction);
    if (logEntry) {
        logEntry.className = 'complete-transaction transaction panel';
        logEntry.removeChild(document.querySelector('#transaction-' + transaction + ' svg'));
        logEntry.appendChild(UI.createFontAwesomeIcon('fa-check'));
    }
};