var should = require('chai').should();
var expect = require('chai').expect;

var VT = require('../src');;
var verifyThat = VT.verifyThat;
var and = VT.and;
var or = VT.or;
var is = VT.is;
var has = VT.has;

var merried = (person) => person.sivilStatus == 'merried';
var retired = (person) => person.age > 67;
var isDeveloper = (person) => person.profession === 1;
var isBelow180 = (person) => person.height < 180;
var isAbove175 = (person) => person.height > 175;

var person = {
  name: 'Emil',
  sivilStatus: 'cohabitant',
  age: 26,
  profession: 1,
  height: 178
}

var isTrue = () => true;
var notTrue = () => false

var checkIsTrue = (val) => expect(val).to.be.true;
var checkIsFalse = (val) => expect(val).to.be.false;

describe('Condititional simple', function() {

  it('should pass on simple booleans', function() {

    var shouldBeTrue = verifyThat({}).is(true).and(true).and(true).isTrue();
    var shouldBeTrue2 = verifyThat({}).is(false).and(true).and(true).or(true).isTrue();
    var shouldBeFalse = verifyThat({}).is(false).and(false).or(false).isTrue();

    expect(shouldBeTrue).to.be.true;
    expect(shouldBeTrue2).to.be.true;
    expect(shouldBeFalse).to.be.false;

    checkIsTrue(and(true));
    checkIsTrue(and(true, true));
    checkIsTrue(and(true, true, true));

    checkIsTrue(or(true));
    checkIsTrue(or(true, true));
    checkIsTrue(or(true, true, true));

    checkIsFalse(and(false));
    checkIsFalse(and(false, false));
    checkIsFalse(and(false, false, true));

    checkIsFalse(or(false));
    checkIsFalse(or(false, false));
    checkIsFalse(or(false, false, false));

  })
  it('should not pass when undefined', function() {
      expect(verifyThat({})
          .is(isTrue)
          .and(undefined)
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

      expect(verifyThat(person)
          .is(retired)
          .and(isDeveloper)
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

      var orEither = or(isDeveloper, false);
      var cond = verifyThat(person)
                    .is(merried)
                    .and(retired, or(isDeveloper, merried)).isTrue();

      expect(cond).to.be.false;

    });

    it("should be possible to combind all operators", function() {

        var cond = verifyThat(person)
                      .is(merried)
                      .and(merried)
                      .and(merried)
                      .or(isDeveloper).isTrue();

        expect(cond).to.be.true;
    });


});
