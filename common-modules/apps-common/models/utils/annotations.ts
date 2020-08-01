export const Override = <Sup>(sup: { prototype: Sup }) => <
  Field extends keyof Sup,
  Proto extends { [key in Field]: Sup[Field] }
>(
  proto: Proto,
  field: Field,
  descr: TypedPropertyDescriptor<Sup[Field]>
) => {};
