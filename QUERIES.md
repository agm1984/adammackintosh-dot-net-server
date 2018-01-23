# Available Queries

## Person
```
query me {
  me {
    person_status
    person_memberType
    person_canBeEmailed
    person_avatar
    person_givenName
    person_familyName
    person_email
    person_tel
    person_gender
    person_birthday
    person_location
    person_bio
    person_created
    person_serialNumber
  }
}

query allPeople {
  allPeople {
    person_status
    person_memberType
    person_canBeEmailed
    person_avatar
    person_givenName
    person_familyName
    person_email
    person_tel
    person_gender
    person_birthday
    person_location
    person_bio
    person_created
    person_serialNumber
  }
}

query GetPerson {
  getPerson(person_serialNumber: "d3cfecd92d60426596588fa683482610") {
    person_status
    person_memberType
    person_canBeEmailed
    person_avatar
    person_givenName
    person_familyName
    person_email
    person_tel
    person_gender
    person_birthday
    person_location
    person_bio
    person_created
    person_serialNumber
  }
}
```

## Article
```
query getAllArticles {
  getAllArticles {
    article_status
    article_title
    article_slug
    article_created
    article_author {
      person_givenName
      person_familyName
    }
    article_tags {
      tag_name
    }
  }
}

query getArticle {
  getArticle(
    article_slug: "How-to-Eat-Onions-Properly"
  ) {
    article_title
    article_slug
    article_content
    article_plainText
    article_created
    article_status
    article_author {
      person_serialNumber
      person_givenName,
      person_familyName,
      person_status
      person_created
    }
    article_tags {
      tag_name
    }
  }
}
```