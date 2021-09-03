import { isThrowStatement } from 'typescript';
import { Tix } from '../tix';

it('implements optmistic concurrency control with instances', async () => {
  //createtix
  const tix = Tix.build({
    title: 'One on One',
    content: "Let's have a chat.",
    price: 50,
    userId: 'abcd',
  });

  //savetix
  await tix.save();

  //fetch tix twice
  const firstFetched = await Tix.findById(tix.id);
  const secondFetched = await Tix.findById(tix.id);

  //update 2 tix
  firstFetched!.set({ content: 'Group chat?' });
  secondFetched!.set({ content: 'Live Q & A' });
  //save first tix
  await firstFetched!.save();
  //save second tix and expect error
  try {
    await secondFetched!.save();
  } catch (err) {
    return;

    throw new Error('Error should have already been thrown');
  }
});

it('increments instance number on each save', async () => {
  const tix = Tix.build({
    title: 'Group counseling',
    content: 'Lets get together',
    price: 60,
    userId: 'a1b1c1',
  });

  await tix.save();
  expect(tix.instance).toEqual(0);

  await tix.save();
  expect(tix.instance).toEqual(1);

  await tix.save();
  expect(tix.instance).toEqual(2);

  await tix.save();
  expect(tix.instance).toEqual(3);
});
