var assert = require('assert');
var RippleRestClient = require('../');

describe('Get account payments info', function(){
  
  before(function(done){
    rippleRestClient = new RippleRestClient({
      account: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz'
    });
    done();
  });
  
  it('should get 10 (max) of the most recent payments', function(done){
    rippleRestClient.getAccountPaymentsInfo(null, function(error, response){
      assert(!error);
      assert.strictEqual(response.success, true);
      assert(response.payments instanceof Array);
      assert(response.payments.length <= 10);
      done();
    });
  });

  it('should fail because of an invalid ripple address', function(done) {
    rippleRestClient.getAccountPaymentsInfo({
        ripple_address: 'invalidAddress'
    }, function(error, response){
      assert.strictEqual(response.success, false);
      assert.strictEqual(response.message, 'Specified address is invalid: account');
      done();
    });
  });
  
});