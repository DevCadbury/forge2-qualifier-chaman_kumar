<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function index($boardId)
    {
        $board = Board::findOrFail($boardId);
        $lists = $board->lists()->with('cards')->orderBy('position')->get();
        return response()->json($lists);
    }

    public function store(Request $request, $boardId)
    {
        $board = Board::findOrFail($boardId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer',
        ]);

        $validated['board_id'] = $boardId;
        $validated['position'] = $validated['position'] ?? $board->lists()->count();

        $list = BoardList::create($validated);
        return response()->json($list, 201);
    }

    public function show($boardId, $listId)
    {
        $list = BoardList::where('board_id', $boardId)
            ->with('cards.tags', 'cards.members')
            ->findOrFail($listId);
        return response()->json($list);
    }

    public function update(Request $request, $boardId, $listId)
    {
        $list = BoardList::where('board_id', $boardId)->findOrFail($listId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|integer',
        ]);

        $list->update($validated);
        return response()->json($list);
    }

    public function destroy($boardId, $listId)
    {
        $list = BoardList::where('board_id', $boardId)->findOrFail($listId);
        $list->delete();
        return response()->json(['message' => 'List deleted successfully']);
    }

    public function move(Request $request, $boardId, $listId)
    {
        $validated = $request->validate([
            'position' => 'required|integer|min:0',
        ]);

        $list = BoardList::where('board_id', $boardId)->findOrFail($listId);
        $list->update(['position' => $validated['position']]);

        return response()->json($list);
    }
}
