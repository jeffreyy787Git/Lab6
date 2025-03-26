"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const model = __importStar(require("../models/articles"));
// Since we are handling articles use a URI that begins with an appropriate path
const router = new koa_router_1.default({ prefix: '/api/v1/articles' });
exports.router = router;
// Temporarily define some random articles in an array.
// Later this will come from the DB.
const articles = [
    { title: 'hello article', fullText: 'some text here to fill the body' },
    { title: 'another article', fullText: 'again here is some text here to fill' },
    { title: 'coventry university ', fullText: 'some news about coventry university' },
    { title: 'smart campus', fullText: 'smart campus is coming to IVE' }
];
// Now we define the handler functions
const getAll = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Use the response body to send the articles as JSON.
    let articles = yield model.getAll();
    if (articles.length) {
        ctx.body = articles;
    }
    else {
        ctx.body = {};
    }
    yield next();
});
const getById = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the ID from the route parameters.
    let id = +ctx.params.id;
    // If it exists then return the article as JSON.
    // Otherwise return a 404 Not Found status code
    /*if ((id < articles.length+1) && (id > 0)) {
        ctx.body = articles[id-1];
    } else {
        ctx.status = 404;
    }*/
    let article = yield model.getById(id);
    if (article.length) {
        ctx.body = article;
    }
    else {
        ctx.body = {};
    }
    yield next();
});
const createArticle = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // The body parser gives us access to the request body on ctx.request.body.
    // Use this to extract the title and fullText we were sent.
    const updateArticle = ctx.request.body;
    // In turn, define a new article for addition to the array.
    // articles.push(updateArticle);
    let article = yield model.add(updateArticle);
    // Finally send back appropriate JSON and status code.
    // Once we move to a DB store, the newArticle sent back will now have its ID.
    ctx.status = 201;
    ctx.body = article;
    yield next();
});
const updateArticle = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = +ctx.params.id;
    const updateArticle = ctx.request.body;
    console.log("updateArticle : ", updateArticle);
    //if((id < articles.length+1) && (id > 0)) {
    try {
        //console.log("original: %d, new: %d",articles[id-1], updateArticle);
        //articles[id-1].title = updateArticle.title;
        //articles[id-1].fullText = updateArticle.fullText;
        let article = yield model.update(updateArticle, id);
        ctx.status = 200;
        ctx.body = article;
    }
    //else{
    catch (err) {
        ctx.status = 404;
    }
    yield next();
});
const deleteArticle = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = +ctx.params.id;
    /*console.log(articles[id-1]);
    if ((id < articles.length+1) && (id > 0)) {
        console.log("deleting");
        articles.splice(id-1, 1);
        ctx.body = articles;
    } else {
        ctx.status = 404;
    }*/
    try {
        let article = yield model.del(id);
        ctx.body = article;
    }
    catch (err) {
        ctx.status = 404;
    }
    yield next();
});
/* Routes are needed to connect path endpoints to handler functions.
When an Article id needs to be matched we use a pattern to match
a named route parameter. Here the name of the parameter will be 'id'
and we will define the pattern to match at least 1 numeral. */
router.get('/', getAll);
router.post('/', (0, koa_bodyparser_1.default)(), createArticle);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', (0, koa_bodyparser_1.default)(), updateArticle);
router.del('/:id([0-9]{1,})', deleteArticle);
