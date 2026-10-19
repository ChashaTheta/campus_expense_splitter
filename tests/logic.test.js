const {test}=require('node:test'),assert=require('node:assert/strict'),{splitAmount,balances,optimize}=require('../server/logic');
test('equal split preserves cents',()=>assert.deepEqual(splitAmount(100,['a','b','c']),{a:33.34,b:33.33,c:33.33}));
test('exact splits must add up',()=>{assert.throws(()=>splitAmount(100,['a','b'],'exact',{a:20,b:70}));assert.deepEqual(splitAmount(100,['a','b'],'exact',{a:20,b:80}),{a:20,b:80})});
test('percentage splits sum to amount',()=>assert.deepEqual(splitAmount(200,['a','b'],'percentage',{a:25,b:75}),{a:50,b:150}));
test('balances and optimized transfers',()=>{let g={id:'g',members:['a','b','c']},ex=[{groupId:'g',paidBy:'a',amount:90,shares:{a:30,b:30,c:30}}],b=balances(g,ex,[]);assert.deepEqual(b,{a:60,b:-30,c:-30});assert.deepEqual(optimize(b),[{from:'b',to:'a',amount:30},{from:'c',to:'a',amount:30}])});
test('settlement reduces debt',()=>{let g={id:'g',members:['a','b']},e=[{groupId:'g',paidBy:'a',amount:100,shares:{a:50,b:50}}];assert.deepEqual(balances(g,e,[{groupId:'g',from:'b',to:'a',amount:50}]),{a:0,b:0})});
