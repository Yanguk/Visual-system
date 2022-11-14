const makeSingleTonFactory = InstanceGenerator => {
  let instance = null;

  return (a) => {
    instance ??= new InstanceGenerator(a);

    return instance;
  }
};

export default makeSingleTonFactory;
