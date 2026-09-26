import * as SQLite from "expo-sqlite";
import {
  atualizarStatusBarreira,
  inicializarBanco,
  inserirBarreira,
  listarBarreiras,
  removerBarreira,
} from "@/database/database";

describe("database (barreiras de acessibilidade)", () => {
  it("cria a tabela ao inicializar o banco", () => {
    inicializarBanco();
    const dbMock = (SQLite.openDatabaseSync as jest.Mock).mock.results[0]
      .value;
    expect(dbMock.execSync).toHaveBeenCalled();
  });

  it("insere uma barreira denunciada com os dados corretos", () => {
    inserirBarreira({
      categoria: "Rampa quebrada",
      descricao: "Rampa com buraco na esquina",
      severidade: "alta",
    });

    const dbMock = (SQLite.openDatabaseSync as jest.Mock).mock.results[0]
      .value;
    expect(dbMock.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO barreiras"),
      expect.arrayContaining(["Rampa quebrada", "Rampa com buraco na esquina", "alta"])
    );
  });

  it("lista as barreiras existentes", () => {
    const resultado = listarBarreiras();
    expect(Array.isArray(resultado)).toBe(true);
  });

  it("atualiza o status de uma barreira para resolvido", () => {
    atualizarStatusBarreira(1, "resolvido");
    const dbMock = (SQLite.openDatabaseSync as jest.Mock).mock.results[0]
      .value;
    expect(dbMock.runSync).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE barreiras SET status"),
      ["resolvido", 1]
    );
  });

  it("remove uma barreira pelo id", () => {
    removerBarreira(1);
    const dbMock = (SQLite.openDatabaseSync as jest.Mock).mock.results[0]
      .value;
    expect(dbMock.runSync).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM barreiras"),
      [1]
    );
  });
});
