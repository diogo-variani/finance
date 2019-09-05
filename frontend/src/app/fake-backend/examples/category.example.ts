import { Category } from "../../models/category";

const CATEGORIES : Category[] = [
  {
    id: "1",
    title: "Alimentação",
    description: "Centraliza despesas com alimentação"
  },

  {
    id: "2",
    parentId: "1",
    title: "Restaurante",
    description: "Despesas gastas com restaurantes"
  },
  {
    id: "3",
    parentId: "1",
    title: "Supermercado",
    description: "Gastos com supermercados"
  },

  {
    id: "4",
    title: "Lazer",
    description: "Centraliza despesas com lazer"
  },

  {
    id: "5",
    parentId: "4",
    title: "Cinema",
    description: "Despesas gastas com cinema"
  },
  {
    id: "6",
    parentId: "4",
    title: "Hotel",
    description: "Gastos com hotel"
  },
  {
    id: "7",
    title: "Pessoal",
    description: "Centraliza despesas pessoais"
  },

  {
    id: "8",
    parentId: "7",
    title: "Roupa",
    description: "Despesas gastas com roupas"
  },
  {
    id: "9",
    parentId: "7",
    title: "Calçados",
    description: "Gastos com calçados"

  },
  {
    id: "10",
    title: "Receitas",
    description: "Centraliza receitas"
  },

  {
    id: "11",
    parentId: "10",
    title: "Salário",
    description: "Centraliza os registros de salários"
  },
  {
    id: "12",
    parentId: "10",
    title: "Poupança",
    description: "Centraliza os valores armazenados em poupança"
  },
  {
    id: "13",      
    title: "Saúde",
    description: "Centraliza despesas com saúde"
  },
]

export { CATEGORIES };