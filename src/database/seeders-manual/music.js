'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */

// Siembra el catálogo (álbumes con canciones, enlaces y recursos) desde
// src/database/seed-data/music.json (export del dashboard). Solo inserta lo que falta: álbumes
// por slug y canciones por (álbum, slug); las filas hijas se añaden solo a lo recién insertado.
// Se ejecuta a mano con `pnpm db:seed:music`.
const { inTransaction, readSeedData } = require('../seed-helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const { albums } = readSeedData('music');

		await inTransaction(queryInterface, Sequelize, async ({ options, query, stamp, missing }) => {
			const insert = (table, rows) =>
				rows.length ? queryInterface.bulkInsert(table, rows, options, {
					themes: { type: Sequelize.ARRAY(Sequelize.TEXT) },
				}) : null;

			// 1) Álbumes y sus enlaces
			const knownAlbums = new Set((await query('SELECT slug FROM "albums"')).map((row) => row.slug));
			const newAlbums = missing(albums, knownAlbums, 'slug');
			await insert('albums', newAlbums.map(({ links, songs, ...album }) => stamp(album)));

			const albumIds = new Map(
				(await query('SELECT id, slug FROM "albums"')).map((row) => [row.slug, row.id]),
			);
			await insert(
				'album-links',
				newAlbums.flatMap((album) =>
					album.links.map((link) => stamp({ ...link, albumId: albumIds.get(album.slug) })),
				),
			);

			// 2) Canciones (de álbumes nuevos y de álbumes que ya existían)
			const knownSongs = new Set(
				(await query('SELECT "albumId", slug FROM "songs"')).map((row) => `${row.albumId}/${row.slug}`),
			);
			const newSongs = albums.flatMap((album) =>
				album.songs
					.map((song) => ({ ...song, albumSlug: album.slug }))
					.filter((song) => !knownSongs.has(`${albumIds.get(album.slug)}/${song.slug}`)),
			);
			await insert(
				'songs',
				newSongs.map(({ links, resources, albumSlug, ...song }) =>
					stamp({ ...song, albumId: albumIds.get(albumSlug) }),
				),
			);

			// 3) Enlaces y recursos de las canciones recién insertadas
			const songIds = new Map(
				(await query('SELECT id, "albumId", slug FROM "songs"')).map((row) => [
					`${row.albumId}/${row.slug}`,
					row.id,
				]),
			);
			const songId = (song) => songIds.get(`${albumIds.get(song.albumSlug)}/${song.slug}`);
			const children = (key) =>
				newSongs.flatMap((song) => song[key].map((child) => stamp({ ...child, songId: songId(song) })));

			await insert('song-links', children('links'));
			await insert('song-resources', children('resources'));
		});
	},

	async down() {},
};
