const typeDefs = `
  #Person Type
  type Person {

    # Person's Member Status
    person_status: String

    # Person's Member Type
    person_memberType: String

    # Person Can Be Emailed?
    person_canBeEmailed: Boolean

    # Person's Avatar
    person_avatar: String

    # Person's First Name
    person_givenName: String

    # Person's Last Name
    person_familyName: String

    # Person's Email
    person_email: String

    # Person's Phone
    person_tel: String

    # Person's Gender
    person_gender: String

    # Person's Birthday
    person_birthday: String

    # Person's Location
    person_location: String

    # Person's Bio
    person_bio: String

    # Person's Join Timestamp
    person_created: String

    # Person's Last Modified Timestamp
    person_lastModified: String

    # Person's Serial Number
    person_serialNumber: String

    # Person's Registration Token
    token: String
  }

  # Article Type
  type Article {

    # Status of the Article
    article_status: String

    # Title of the Article
    article_title: String

    # URL Slug for the Article
    article_slug: String

    # Plain Text of the Article
    article_plainText: String

    # Content of the Article
    article_content: String

    # Created Timestamp of the Article
    article_created: String

    # Last Modified Timestamp of the Article
    article_lastModified: String

    # Serial Number of Person that last modified the Article
    article_lastModifiedBy: String

    # Author of the Article
    article_author: Person

    # Tags of the Article
    article_tags: [Tag]
  }

  # Author Type
  type Author {

    # Email Address of the Author
    author_email: String

    # Account Status of the Author
    author_status: String

    # Join Date of the Author
    author_created: String
  }

  # Tag Type
  type Tag {

    # Name of the Tag
    tag_name: String
  }

  #The schema allows the following queries:
  type Query {

    # Get a Person
    me: Person

    # Get all People
    getAllPeople: [Person]

    # Get a Person by Serial Number
    getPerson(
      person_serialNumber: String!
    ): Person

    # Get all Articles
    getAllArticles: [Article]

    # Get an Article
    getArticle(
      article_slug: String!
    ): Article
  }

  #This schema allows the following mutations:
  type Mutation {

    # Register a new Person
    register(
      person_status: String!
      person_memberType: String!
      person_canBeEmailed: Boolean
      person_avatar: String
      person_givenName: String!
      person_familyName: String!
      person_email: String!
      person_tel: String
      person_gender: String
      person_birthday: String
      person_location: String!
      person_bio: String
      person_password: String!
    ): Person

    # Login to the System
    login(
      person_email: String!
      person_password: String!
    ): String

    # Add a new Person
    addPerson(
      person_status: String!
      person_memberType: String!
      person_canBeEmailed: Boolean
      person_avatar: String
      person_givenName: String!
      person_familyName: String!
      person_email: String!
      person_tel: String
      person_gender: String
      person_birthday: String
      person_location: String!
      person_bio: String
      person_password: String!
    ): Person

    # Edit a Person
    editPerson(
      person_serialNumber: String!
      person_status: String
      person_memberType: String
      person_canBeEmailed: Boolean
      person_avatar: String
      person_givenName: String
      person_familyName: String
      person_email: String
      person_tel: String
      person_gender: String
      person_birthday: String
      person_location: String
      person_bio: String
      person_password: String
    ): Person

    # Add an Article
    addArticle(
      article_status: String!
      article_title: String!
      article_plainText: String!
      article_content: String!
      article_authorSerialNumber: String!
      article_tags: String!
    ): Article

    # Edit an Article
    editArticle(
      article_editorSerialNumber: String!
      article_oldSlug: String!
      article_status: String
      article_title: String
      article_plainText: String
      article_content: String
      article_tags: String
    ): Article

    # Delete an Article
    deleteArticle(
      article_slug: String!
      article_editorSerialNumber: String!
    ): String

    # Deactivate an Article
    deactivateArticle(
      article_slug: String!
      article_editorSerialNumber: String!
    ): String
   }
`

export default typeDefs
