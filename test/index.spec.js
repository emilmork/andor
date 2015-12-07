var should = require('chai').should();
var expect = require('chai').expect;

var VT = require('../dist/index.js');;
var verifyThat = VT.verifyThat;
var and = VT.and;
var or = VT.or;
var is = VT.is;

var merried = (person) => person.civilStatus == 'merried';
var retired = (person) => person.age > 67;
var isDeveloper = (person) => person.isDeveloper;

var isTrue = () => true;
var notTrue = () => false

describe('Condititional simple', function() {

  it('should not pass when undefined', function() {
      expect(verifyThat({})
          .is(isTrue)  
          .and(false)
          .isTrue()).to.be.false;
  });

  it('should not pass when .and() is falsy', function() {
      expect(verifyThat({})
          .is(isTrue)
          .and(isTrue)
          .and(notTrue)
          .and(isTrue)    
          .isTrue()).to.be.false;
  });
  
  it('should pass when .or() is true', function() {
      expect(verifyThat({})
          .is(isTrue)
          .or(notTrue)
          .or(notTrue)
          .or(isTrue)    
          .or(notTrue)    
          .isTrue()).to.be.true;
  });

  it('should not pass when .and() is falsy', function() {
      expect(verifyThat({})
          .is(isTrue)
          .or(notTrue)
          .or(notTrue)
          .or(isTrue)       
          .isTrue()).to.be.true;
  });

});

describe('Conditions with data', function() {

    it('should pass when person is 40 years old and merried', function() {
      var person = { civilStatus: 'merried', age: 40 };

      expect(verifyThat(person)
          .is(merried)  
          .and(retired)
          .isTrue()).to.be.false;
    });

    it('should pass when passing custom data', function() {
      var person = { civilStatus: 'single', age: 40 };

      expect(verifyThat(person)
          .is(!retired)
          .and(merried)
          .isTrue()).to.be.false;
    });
});

describe('Single conditions without chaining', function() {

    it('should be possible to pass multiple functions to and', function() {
      expect(and(
        isTrue,
        notTrue,
        isTrue,
        isTrue)).to.be.false;
    });

    it('should be possible to pass multiple booleans to and', function() {
      expect(and(
        true,
        false,
        true,
        true)).to.be.false;
    });

    it('should be possible to pass multiple functions to or', function() {
      expect(or(
        isTrue,
        isTrue,
        notTrue,
        notTrue)).to.be.true;
    });

});

describe('Combined nested expresstions', function() {

    it('should be possible to pass or´s to and', function() {
      
      var cond = and(isTrue, or(isTrue, notTrue));

      expect(cond).to.be.true;
    });

    it('should be possible to pass and´s to ors', function() {

      var cond = or(and(false, isTrue), false, or(notTrue, isTrue));

      expect(cond).to.be.true;

    });

    it('should be possible to pass (and/ors) to chain', function() {
      var person = { civilStatus: 'merried', age: 40, isDeveloper: true };

      var cond = verifyThat(person)
                    .is(merried)
                    .and(retired, or(isDeveloper, false)).isTrue;

      expect(cond).to.be.false;

    });


});

