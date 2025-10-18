BEGIN -- Создание базы данных
	IF DB_ID(N'games_db') IS NULL BEGIN
		CREATE DATABASE [games_db]
	END ELSE
		PRINT N'База данных [games_db] уже существует'
END
GO

BEGIN -- Созадние таблиц
	USE [games_db]

	IF OBJECT_ID(N'genre', N'U') IS NULL BEGIN
		CREATE TABLE [genre](
			[id] INT NOT NULL IDENTITY,
			[name] NVARCHAR(50) NOT NULL,
			[description] NVARCHAR(MAX) NULL,

			CONSTRAINT [PK_genre_id] PRIMARY KEY([id])
		)
	END ELSE 
		PRINT N'Таблица genre уже существует'

	IF OBJECT_ID(N'game', N'U') IS NULL BEGIN
		CREATE TABLE [game](
			[id] INT NOT NULL IDENTITY,
			[title] NVARCHAR(150) NOT NULL,
			[description] NVARCHAR(MAX) NOT NULL,
			[price] MONEY NOT NULL,
			[date_of_release] DATE NOT NULL,
			[rating] TINYINT NULL,
			[genre_id] INT,

			CONSTRAINT [PK_game_id] PRIMARY KEY([id]),
			CONSTRAINT [FK_game_genre] FOREIGN KEY([genre_id])
				REFERENCES [genre]([id]),
			CONSTRAINT [C_game_price] CHECK([price] >= 0),
			CONSTRAINT [C_game_rating] CHECK([rating] >= 0 AND [rating] <= 100)
		)
	END ELSE 
		PRINT N'Таблица game уже существует'
END
GO

BEGIN -- Заполнение таблиц данными
    SET IDENTITY_INSERT [genre] ON
    INSERT INTO
        [genre]([id], [name], [description])
    VALUES
        (1, 'Action', N'Игры с акцентом на действие и динамику.'),
        (2, 'Adventure', N'Игры, сосредоточенные на исследовании и приключениях.'),
        (3, 'RPG', N'Ролевые игры с глубоким сюжетом и развитием персонажа.')
    SET IDENTITY_INSERT [genre] OFF

    SET IDENTITY_INSERT [game] ON
    INSERT INTO
        [game]([id], [title], [description], [price], [date_of_release], [rating], [genre_id])
    VALUES
        (1, 'Epic Adventure', N'Исследуйте забытые цивилизации в масштабном RPG-приключении с нелинейным сюжетом и динамической системой морального выбора. Ваши решения влияют на судьбу целых королевств.', 59.99, '2022-06-01', 85, 2),
        (2, 'Battlefield Warriors', N'Тактический шутер с разрушаемыми ландшафтами и 64 игроками на карте. Реалистичная баллистика и система укрытий. Создавайте альянсы или сражайтесь в одиночку.', 49.99, '2021-11-15', 90, 1),
        (3, 'Mystery of the Ancients', N'Археологический квест с головоломками на стыке науки и мифологии. Расшифровывайте древние тексты, избегайте ловушек в пирамидах и раскройте тайну бессмертия.', 39.99, '2023-01-10', 75, 3),
        (4, 'Space Explorer', N'Космический симулятор с процедурной генерацией планет. Стройте межзвездные колонии, торгуйте редкими ресурсами и участвуйте в галактических войнах кланов.', 59.99, '2022-07-07', 82, 2),
        (5, 'Heroic Saga', N'Эпическая сага о восхождении от простого крестьянина до легендарного полководца. Система развития навыков через 200+ уникальных квестов.', 39.99, '2020-11-11', 88, 3)
    SET IDENTITY_INSERT [game] OFF
END
GO

            SELECT  [g].[title] as [Title],
                    [g].[description] as [Description],
                    [gr].[name] as [Genre],
                    FORMAT([g].[date_of_release], N'dd.MM.yyyy') as [DateOfRelease],
                    [g].[rating] as [Rating],
                    FORMAT([g].[price], N'C', N'en-us') as [Price]
            FROM [game] as [g] 
            JOIN [genre] as [gr]
                 ON [g].[genre_id] = [gr].[id]
