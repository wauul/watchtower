import {test,expect} from 'vitest';
import {discountSnapshot,dealSort} from '../../src/lib/deal-feed';
test('discount uses the first observed price, not the highest price',()=>{expect(discountSnapshot([100,200,80])).toEqual({referencePrice:100,discountPercent:20});});
test('unknown histories remain unknown and price increases never become discounts',()=>{expect(discountSnapshot([]).discountPercent).toBeNull();expect(discountSnapshot([100]).discountPercent).toBeNull();expect(discountSnapshot([0,20]).discountPercent).toBeNull();expect(discountSnapshot([100,120]).discountPercent).toBe(0);});
test('discount percentages are comparable across currencies and rounded',()=>{expect(discountSnapshot([300,200]).discountPercent).toBe(33.33);expect(discountSnapshot([30,20]).discountPercent).toBe(33.33);});
test('sort query is strictly allowlisted',()=>{expect(dealSort('liked')).toBe('liked');expect(dealSort('discount')).toBe('discount');expect(dealSort('DROP TABLE')).toBe('recent');expect(dealSort(['liked'])).toBe('recent');});
