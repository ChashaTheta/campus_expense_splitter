function round(n){return Math.round((Number(n)+Number.EPSILON)*100)/100}
function splitAmount(amount, members, mode='equal', values={}){
 const cents=Math.round(Number(amount)*100);if(!Number.isInteger(cents)||cents<=0)throw Error('Amount must be positive');if(!members.length)throw Error('Choose members');
 let shares={};
 if(mode==='equal'){let base=Math.floor(cents/members.length),rem=cents%members.length;members.forEach((id,i)=>shares[id]=(base+(i<rem?1:0))/100)}
 else if(mode==='exact'){let total=0;members.forEach(id=>{let v=Math.round(Number(values[id]||0)*100);if(v<0||!Number.isFinite(v))throw Error('Invalid share');shares[id]=v/100;total+=v});if(total!==cents)throw Error('Exact shares must add up to expense amount')}
 else if(mode==='percentage'){let total=members.reduce((s,id)=>s+Number(values[id]||0),0);if(Math.abs(total-100)>0.00001)throw Error('Percentages must total 100');let allocated=0;members.forEach((id,i)=>{let c=i===members.length-1?cents-allocated:Math.round(cents*Number(values[id]||0)/100);if(c<0)throw Error('Invalid percentage');shares[id]=c/100;allocated+=c})}
 else throw Error('Unknown split mode');return shares
}
function balances(group, expenses, settlements){const b=Object.fromEntries(group.members.map(m=>[m,0]));for(const e of expenses.filter(x=>x.groupId===group.id)){if(!(e.paidBy in b))continue;b[e.paidBy]=round(b[e.paidBy]+e.amount);for(const [id,share] of Object.entries(e.shares))if(id in b)b[id]=round(b[id]-share)}for(const s of settlements.filter(x=>x.groupId===group.id)){if(s.from in b)b[s.from]=round(b[s.from]+s.amount);if(s.to in b)b[s.to]=round(b[s.to]-s.amount)}return b}
function optimize(b){let debtors=[],creditors=[];for(const [id,v] of Object.entries(b)){let cents=Math.round(v*100);if(cents<0)debtors.push({id,cents:-cents});else if(cents>0)creditors.push({id,cents})}debtors.sort((a,b)=>b.cents-a.cents);creditors.sort((a,b)=>b.cents-a.cents);let i=0,j=0,out=[];while(i<debtors.length&&j<creditors.length){let c=Math.min(debtors[i].cents,creditors[j].cents);if(c>0)out.push({from:debtors[i].id,to:creditors[j].id,amount:c/100});debtors[i].cents-=c;creditors[j].cents-=c;if(!debtors[i].cents)i++;if(!creditors[j].cents)j++}return out}
module.exports={round,splitAmount,balances,optimize}
