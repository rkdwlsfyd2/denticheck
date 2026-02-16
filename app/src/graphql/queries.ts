import { gql } from '@apollo/client';

export const GET_HOSPITALS = gql`
  query GetHospitals {
    hospitals {
      id
      name
      address
      phone
      description
      latitude
      longitude
      homepageUrl
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts($limit: Int, $offset: Int, $postType: String) {
    posts(limit: $limit, offset: $offset, postType: $postType) {
      id
      author
      authorInitial
      content
      images
      tags {
        type
        name
      }
      likes
      comments
      createdAt
      postType
      isMine
      isLiked
    }
  }
`;

export const TOGGLE_POST_LIKE = gql`
  mutation TogglePostLike($postId: ID!) {
    togglePostLike(postId: $postId) {
      isLiked
      likeCount
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export const GET_DENTALS = gql`
  query GetDentals($name: String, $limit: Int) {
    dentals(name: $name, limit: $limit) {
      id
      name
      address
      phone
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      author
      authorInitial
      content
      images
      tags {
        type
        name
      }
      likes
      comments
      createdAt
      postType
      isMine
      isLiked
    }
  }
`;
