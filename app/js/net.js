var Net = {};

if (typeof web3 !== 'undefined') {
    // is web3 already provided by the Mist browser?
    Net.web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    Net.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

Net.pendingFilter = Net.web3.eth.filter('pending');
Net.latestFilter = Net.web3.eth.filter('latest');

Net.sendTransaction = function(request, callback) {
    Net.web3.eth.sendTransaction(request, function(error, response) {
        Net.web3.eth.getTransaction(response, function(error, tx) {
            callback(error, tx);
        });
    });
};

Net.subscribeToPending = function (callback) {
    Net.pendingFilter.watch(function (error, val) {
        callback(val);
    });
};

Net.subscribeToLatest = function (callback) {
    Net.latestFilter.watch(function (error, blockHash) {
        Net.web3.eth.getBlock(blockHash, function (error, block) {
            block.transactions.forEach(callback);
        });
    });
};

Net.queryAccounts = function (err, callback) {
    Net.web3.eth.getAccounts(function (error, accounts) {
        if (!error) {
            accounts.forEach(callback);
        } else {
            err();
        }
    });
};