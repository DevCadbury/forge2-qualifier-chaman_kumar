<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\MemberController;

Route::prefix('v1')->group(function () {

    // Board routes
    Route::get('/boards', [BoardController::class, 'index']);
    Route::post('/boards', [BoardController::class, 'store']);
    Route::get('/boards/{id}', [BoardController::class, 'show']);
    Route::put('/boards/{id}', [BoardController::class, 'update']);
    Route::delete('/boards/{id}', [BoardController::class, 'destroy']);

    // List routes
    Route::get('/boards/{boardId}/lists', [ListController::class, 'index']);
    Route::post('/boards/{boardId}/lists', [ListController::class, 'store']);
    Route::get('/boards/{boardId}/lists/{listId}', [ListController::class, 'show']);
    Route::put('/boards/{boardId}/lists/{listId}', [ListController::class, 'update']);
    Route::delete('/boards/{boardId}/lists/{listId}', [ListController::class, 'destroy']);
    Route::patch('/boards/{boardId}/lists/{listId}/move', [ListController::class, 'move']);

    // Card routes
    Route::get('/boards/{boardId}/lists/{listId}/cards', [CardController::class, 'index']);
    Route::post('/boards/{boardId}/lists/{listId}/cards', [CardController::class, 'store']);
    Route::get('/boards/{boardId}/lists/{listId}/cards/{cardId}', [CardController::class, 'show']);
    Route::put('/boards/{boardId}/lists/{listId}/cards/{cardId}', [CardController::class, 'update']);
    Route::delete('/boards/{boardId}/lists/{listId}/cards/{cardId}', [CardController::class, 'destroy']);
    Route::patch('/boards/{boardId}/lists/{listId}/cards/{cardId}/move', [CardController::class, 'move']);

    // Tag routes
    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::get('/tags/{id}', [TagController::class, 'show']);
    Route::put('/tags/{id}', [TagController::class, 'update']);
    Route::delete('/tags/{id}', [TagController::class, 'destroy']);

    // Card-Tag relationship routes
    Route::post('/cards/{cardId}/tags/{tagId}', [CardController::class, 'attachTag']);
    Route::delete('/cards/{cardId}/tags/{tagId}', [CardController::class, 'detachTag']);

    // Member routes
    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/members/{id}', [MemberController::class, 'show']);
    Route::put('/members/{id}', [MemberController::class, 'update']);
    Route::delete('/members/{id}', [MemberController::class, 'destroy']);

    // Card-Member relationship routes
    Route::post('/cards/{cardId}/members/{memberId}', [CardController::class, 'assignMember']);
    Route::delete('/cards/{cardId}/members/{memberId}', [CardController::class, 'removeMember']);

    // Due date routes
    Route::put('/cards/{cardId}/due-date', [CardController::class, 'setDueDate']);
    Route::delete('/cards/{cardId}/due-date', [CardController::class, 'removeDueDate']);
});
