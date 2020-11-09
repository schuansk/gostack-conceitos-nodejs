const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Apenas um comentário
function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'invalid repository ID'});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { 
    title,
    url,
    techs
  } = request.body;

  const likes = 0;

  const repository = {
    id: uuid(), 
    title, 
    url, 
    techs,  
    likes
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { 
    title,
    url,
    techs 
  } = request.body;

  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(respositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const likes = repositories[respositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[respositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json('Repository not found');
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json('Repository not found');
  }
  
  const likes = repositories[repositoryIndex].likes + 1;

  const repository = {
    id,
    title: repositories[repositoryIndex].title,
    url: repositories[repositoryIndex].url,
    techs: repositories[repositoryIndex].techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;