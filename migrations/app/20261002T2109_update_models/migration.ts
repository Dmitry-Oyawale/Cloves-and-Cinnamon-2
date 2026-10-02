#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/266645493941c8dbdc0e07890ba11f15e87279628e7ec819215432e7dad9dcd5/contract';
import startContract from '../../snapshots/266645493941c8dbdc0e07890ba11f15e87279628e7ec819215432e7dad9dcd5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f268836801b376f530fff305afe6e02ef718bd12d1d2aa4213db671f527d4cdd/contract';
import endContract from '../../snapshots/f268836801b376f530fff305afe6e02ef718bd12d1d2aa4213db671f527d4cdd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      // Destructive rebuild: existing app data is intentionally discarded.
      this.dropTable({ schema: 'public', table: 'Comment' }),
      this.dropTable({ schema: 'public', table: 'PostLike' }),
      this.dropTable({ schema: 'public', table: 'Post' }),

      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Comment',
        columns: [
          col('content', 'text', {
            notNull: true,
            default: lit(''),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ownerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('postId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Post',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ownerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('published', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('title', 'text', {
            notNull: true,
            default: lit(''),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'PostLike',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ownerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('postId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_ownerId_createdAt_idx_ffd2310a',
        columns: ['ownerId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_postId_idx_a7a72715',
        columns: ['postId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_ownerId_published_idx_fe5920e7',
        columns: ['ownerId', 'published'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PostLike',
        index: 'PostLike_ownerId_createdAt_idx_ffd2310a',
        columns: ['ownerId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'PostLike',
        index: 'PostLike_postId_idx_a7a72715',
        columns: ['postId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Comment',
        foreignKey: {
          name: 'Comment_postId_fkey',
          columns: ['postId'],
          references: { schema: 'public', table: 'Post', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'PostLike',
        foreignKey: {
          name: 'PostLike_postId_fkey',
          columns: ['postId'],
          references: { schema: 'public', table: 'Post', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
