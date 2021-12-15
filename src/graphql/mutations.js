/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

// export const updateTodo = /* GraphQL */ `
//   mutation UpdateTodo(
//     $input: UpdateTodoInput!
//     $condition: ModelTodoConditionInput
//   ) {
//     updateTodo(input: $input, condition: $condition) {
//       id
//       name
//       description
//       createdAt
//       updatedAt
//     }
//   }
// `;

export const updateTodo = /* GraphQL */`
  mutation UpdateTodo($id: ID!, $name:String! , $description:String! ) 
  {
    updateTodo(input:{ id: $id, name: $name, description: $description })
    {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;


export const deleteTodo = /* GraphQL */`
  mutation deleteTodo($id: ID!) 
  {
    deleteTodo(input:{ id: $id })
    {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
