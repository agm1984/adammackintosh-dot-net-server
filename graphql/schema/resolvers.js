import {
  me, getAllPeople, getPerson, getAllArticles, getArticle,
} from './queries'
import {
  getAuthor, getTags,
} from './queries/Article'
import {
  register, login, addPerson, editPerson, addArticle, editArticle, deleteArticle,
} from './mutations'

const resolvers = {
  Query: {
    me: (root, args, context) => me(root, args, context),
    getAllPeople: (root, args, context) => getAllPeople(root, args, context),
    getPerson: (root, args, context) => getPerson(root, args, context),
    getAllArticles: (root, args, context) => getAllArticles(root, args, context),
    getArticle: (root, args, context) => getArticle(root, args, context),
  },
  Mutation: {
    register: (root, args, context) => register(root, args, context),
    login: (root, args, context) => login(root, args, context),
    addPerson: (root, args, context) => addPerson(root, args, context),
    editPerson: (root, args, context) => editPerson(root, args, context),
    addArticle: (root, args, context) => addArticle(root, args, context),
    editArticle: (root, args, context) => editArticle(root, args, context),
    deleteArticle: (root, args, context) => deleteArticle(root, args, context),
  },
  Article: {
    article_author: (root, args, context) => getAuthor(root, args, context),
    article_tags: (root, args, context) => getTags(root, args, context),
  },
}

export default resolvers
