export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementationOnce(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};

//This file automatically redirects import statements to natsWrapper filr
// while we were running our test to this Mock's natsWrapper file insted
//