<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        $boards = Board::with('lists.cards')->get();
        return response()->json($boards);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $board = Board::create($validated);
        return response()->json($board, 201);
    }

    public function show($id)
    {
        $board = Board::with('lists.cards.tags', 'lists.cards.members')->findOrFail($id);
        return response()->json($board);
    }

    public function update(Request $request, $id)
    {
        $board = Board::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        $board->update($validated);
        return response()->json($board);
    }

    public function destroy($id)
    {
        $board = Board::findOrFail($id);
        $board->delete();
        return response()->json(['message' => 'Board deleted successfully']);
    }
}
