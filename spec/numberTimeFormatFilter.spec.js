'use strict';

describe("filter", function(){

    beforeEach(module('MMOVIT'));  

    it('has a bool filter', inject(function($filter) {
        expect($filter('numberTimeFormat')).not.toBeNull();
    }));


    it('should return correct strings for numbers', inject(function (numberTimeFormatFilter){
      expect(numberTimeFormatFilter(0)).toBe('00:00:00.0');
      expect(numberTimeFormatFilter(-2.6)).toBe('00:00:00.0');
      expect(numberTimeFormatFilter('onzin')).toBe('00:00:00.0');
      expect(numberTimeFormatFilter(10.0)).toBe('00:00:10.0');
      expect(numberTimeFormatFilter(10.7)).toBe('00:00:10.7');
      expect(numberTimeFormatFilter(0.0)).toBe('00:00:00.0');
      expect(numberTimeFormatFilter(60.0)).toBe('00:01:00.0');
      expect(numberTimeFormatFilter(67.8)).toBe('00:01:07.8');
      expect(numberTimeFormatFilter(3600)).toBe('01:00:00.0');
      expect(numberTimeFormatFilter(3659.9)).toBe('01:00:59.9');
      expect(numberTimeFormatFilter(3660)).toBe('01:01:00.0');
    }));
});