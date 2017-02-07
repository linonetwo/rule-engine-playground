defmodule RuleEnginePlayground do
  @moduledoc """
  Documentation for RuleEnginePlayground.
  """

  @doc """
  Hello world.

  ## Examples

      iex> RuleEnginePlayground.hello
      :world

  """
  def hello do
    :worlds
  end

  @doc """
  <~>
  not in
  find whether a value is not inside a list
  """
  defp value <~> list do
    Enum.find_value(list, false, &(&1 != value))
  end

  defp format_compare(rule) do
    re_less_than_frag = ~r/(\S+) less than (\S+)/i
    re_large_than_frag = ~r/(\S+) large than (\S+)/i
    re_equal_to_frag = ~r/(\S+) equal to (\S+)/i

    rule
    |> (fn (rule) -> Regex.replace(re_less_than_frag, rule, "^\\g{1} < \\g{2}") end).()
    |> (fn (rule) -> Regex.replace(re_large_than_frag, rule, "^\\g{1} > \\g{2}") end).()
    |> (fn (rule) -> Regex.replace(re_equal_to_frag, rule, "^\\g{1} = \\g{2}") end).()
  end

  @doc """
  exampel:
    format_is("aaa is bbb")
    "^aaa = bbb"
  """
  def format_is(rule) do
    re_is_literal_frag = ~r/(\S+) is "(\S+)"/i
    re_is_atom_frag = ~r/(\S+) is ([^"\s]+)/i

    rule
    |> (fn (rule) -> Regex.replace(re_is_literal_frag, rule, "^\\g{1} = \"\\g{2}\"") end).()
    |> (fn (rule) -> Regex.replace(re_is_atom_frag, rule, "^\\g{1} = :\\g{2}") end).()
  end

  def parse(rule) do
    rule
    |> format_is
    |> format_compare
    # |> Code.string_to_quoted
  end
end
