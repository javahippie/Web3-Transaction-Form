var web3;
var pendingFilter;
var latestFilter;


if (typeof web3 !== 'undefined') {
    // is web3 already provided by the Mist browser?
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

document.body.onload = function () {
    queryAccounts();
    addFormListener();
    pendingFilter = web3.eth.filter('pending');
    latestFilter = web3.eth.filter('latest');
    subscribeToPending();
    subscribeToLatest();
};

function queryAccounts() {
    web3.eth.getAccounts(function (error, accounts) {
        if (!error) {
            accounts.forEach(UI.addAccountToRadioSelector);
        } else {
            UI.disableForm();
        }
    });
}

function addFormListener() {
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        var form = event.target;
        var request = {from: form.elements.account.value,
            to: form.elements.recipient.value,
            value: form.elements.transactionValue.value};

        web3.eth.sendTransaction(request, sendTransactionCallback);
    });
}

function sendTransactionCallback(error, response) {
    if (error) {
        alert(error);
    } else {
        UI.createLogPanel(response);
    }
}

function subscribeToPending() {
    pendingFilter.watch(function (error, val) {
        UI.setLogPanelPending(val);
    });
}

function subscribeToLatest() {
    latestFilter.watch(function (error, blockHash) {
        web3.eth.getBlock(blockHash, function (error, block) {
            block.transactions.forEach(UI.setLogPanelComplete);
        });
    });
}


