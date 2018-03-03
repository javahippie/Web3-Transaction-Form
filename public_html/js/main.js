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

document.body.onload = initialize;

function initialize() {
    queryAccounts();
    addFormListener();
    pendingFilter = web3.eth.filter('pending');
    latestFilter = web3.eth.filter('latest');
}

function queryAccounts() {
    web3.eth.getAccounts(function (error, accounts) {
        if (!error) {
            accounts.forEach(addAccountToRadioSelector);
        }
    });
}

function addAccountToRadioSelector(account) {
    var queryRadio = document.querySelector('#account-selector');

    var input = document.createElement('option');
    input.value = account;
    input.textContent = account;

    input.id = 'account-' + account;
    queryRadio.appendChild(input);
    queryRadio.appendChild(label);
}

function addFormListener() {
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        var form = event.target;
        var request = {from: form.elements.account.value,
            to: form.elements.recipient.value,
            value: form.elements.transactionValue.value};
        subscribeToPending();
        web3.eth.sendTransaction(request, sendTransactionCallback);
        subscribeToLatest();

    });
}

function sendTransactionCallback(error, response) {
    if (error) {
        alert(error);
    } else {
        var log = document.querySelector('#transaction-log');
        var entry = document.createElement('div');
        entry.id = 'transaction-' + response;
        entry.textContent = response;
        entry.className = 'waiting-transaction transaction';

        var icon = document.createElement('i');
        icon.className = "fa fa-pause";
        entry.appendChild(icon);

        log.appendChild(entry);
    }
}

function subscribeToPending() {
    pendingFilter.watch(function (error, val) {
        console.log('Registered pending transaction:' + JSON.stringify(val));
        var logEntry = document.querySelector('#transaction-' + val);
        logEntry.className = 'pending-transaction transaction';
        logEntry.removeChild(document.querySelector('#transaction-' + val + ' svg'));

        var icon = document.createElement('i');
        icon.className = "fa fa-clock";
        logEntry.appendChild(icon);
    });
}

function subscribeToLatest() {
    latestFilter.watch(function (error, blockHash) {
        web3.eth.getBlock(blockHash, function (error, block) {
            console.log('Registered new block: ' + JSON.stringify(block));
            block.transactions.forEach(function (transaction) {
                var logEntry = document.querySelector('#transaction-' + transaction);
                if (logEntry) {
                    logEntry.className = 'complete-transaction transaction';
                    logEntry.removeChild(document.querySelector('#transaction-' + transaction + ' svg'));

                    var icon = document.createElement('i');
                    icon.className = "fa fa-check";
                    logEntry.appendChild(icon);
                }
            });
        });
    });
}

function unsubscribePending() {
    pendingFilter.stopWatching();
}