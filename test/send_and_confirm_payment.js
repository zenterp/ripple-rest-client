const Client = require('../');
const assert = require('assert');
const fixtures = require('./fixtures');
const uuid = require('node-uuid');

var SECRET = process.env.RIPPLE_ACCOUNT_SECRET;

describe('Ripple REST Client sendPayment', function() {
  var client, payment, faildPayment, nonXRPayment;

  beforeEach(function () {
    client = new Client({
      account: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz'
    });
  });

  if(SECRET){
    it('should send and confirm payment via the response payment status url', function(done){
      this.timeout(10000);
      payment = {
        source_account: fixtures.ripple_address.source_account,
        source_amount: { value: '.005', currency: 'SWD', issuer: '' },
        destination_account: fixtures.ripple_address.destination_account,
        destination_amount: { value: '1', currency: 'SWD', issuer: fixtures.ripple_address.source_account },
        partial_payment: false,
        no_direct_ripple: false,
        destination_tag: '0'
      };

      var paymentObj = {
        payment: payment,
        client_resource_id: uuid.v4(),
        secret: SECRET
      };

      client.sendAndConfirmPayment(paymentObj, function(error, response){
        assert.strictEqual(response.source_account, payment.source_account);
        assert.strictEqual(response.result, 'tesSUCCESS');
        done();
      });

    });

    it('should successfully send and confirm a non-XRP payment', function(done){
      this.timeout(10000);
      nonXRPayment = {
        source_account: fixtures.ripple_address.source_account,
        source_amount: { value: '1', currency: 'SWD', issuer: '' },
        destination_account: fixtures.ripple_address.destination_account,
        destination_amount: { value: '1', currency: 'SWD', issuer: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz' },
        partial_payment: false,
        no_direct_ripple: false,
        destination_tag: '0'
      };

      var nonXRPaymentObj = {
        payment: nonXRPayment,
        client_resource_id: uuid.v4(),
        secret: SECRET
      };

      client.sendAndConfirmPayment(nonXRPaymentObj, function(error, response){
        assert.strictEqual(response.source_account, payment.source_account);
        assert.strictEqual(response.result, 'tesSUCCESS');
        assert.strictEqual(response.destination_amount.currency, nonXRPayment.destination_amount.currency);
        done();
      });
    });

    it('should fail because destination account and amount is missing', function(done){
      this.timeout(10000);
      faildPayment = {
        source_account: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
        source_amount: { value: '.005', currency: 'XRP', issuer: '' },
        destination_account: '',
        destination_amount: {},
        partial_payment: false,
        no_direct_ripple: false
      };

      var paymentObj = {
        payment: faildPayment,
        client_resource_id: uuid.v4(),
        secret: SECRET
      };

      client.sendAndConfirmPayment(paymentObj, function(error, response){
        assert(error);
        assert.strictEqual(error.error_type, 'invalid_request');
        done();
      });
    });

  } else {
    it.skip('should fail because destination account and amount is missing -- MISSING SECRET, so skipping test');
  }

});
